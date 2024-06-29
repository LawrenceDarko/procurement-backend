import { Request, Response } from 'express';
import Budget from '../models/Budget';
import Organization from '../models/Organization';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import User from '../models/User';

export const createBudget = async (req: Request, res: Response) => {
    const {
        financialYear, department, subDepartment, itemCategory, itemSubCategory,
        item, unitPrice, quantity, productSpecification, IFTNumber, currency,
        totalEstimatedAmount, organizationId, budgetOwnerId, otherItem
    } = req.body;

    const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(400).json({ message: 'Organization does not exist' });
        }

    const budgetOwner = await User.findById(budgetOwnerId);
    if (!budgetOwner) {
        return res.status(400).json({ message: 'Budget Owner does not exist' });
    }

    try {
        const budget = await Budget.create({
            financialYear,
            department,
            subDepartment: subDepartment || undefined,
            itemCategory: itemCategory || undefined,
            itemSubCategory: itemSubCategory || undefined,
            organization: organization._id,
            item: item || undefined,
            unitPrice,
            quantity,
            productSpecification: productSpecification || undefined,
            IFTNumber,
            currency,
            totalEstimatedAmount,
            budgetOwner: budgetOwner!._id,
            otherItem: otherItem || undefined
        });

        res.status(201).json({success: true, data: budget, message: 'Budget Created Successfully'});
    } catch (error) {
        console.log("ERROR CREATING BUDGET", error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const createBudgetsInBulk = async (req: Request, res: Response) => {
    const budgets = req.body;

    if (!Array.isArray(budgets)) {
        return res.status(400).json({ message: 'Invalid data format. "budgets" should be an array.' });
    }

    try {
        const createdBudgets = await Budget.insertMany(budgets);
        res.status(201).json({success: true, data: createdBudgets, message: 'Budget Created Successfully'});
    } catch (error) {
        console.log("ERROR CREATING BUDGET IN BULK", error)
        res.status(500).json({ message: 'Server error' });
    }
};


export const getBudgets = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { year, departmentId } = req.query;
        let filter: any = {};

        if (year) {
            filter.financialYear = year;
        }
        if (departmentId) {
            filter.department = departmentId;
        }
        const budgets = await Budget.find({ ...filter, organization: req.user!.organization}).populate('department subDepartment itemCategory itemSubCategory item organization budgetOwner');

        const groupedBudgets: { [year: string]: any } = {};

        budgets.forEach((budget) => {
            const year = budget.financialYear;
            if (!groupedBudgets[year]) {
            groupedBudgets[year] = {
                budgetYear: year,
                totalBudget: 0,
                totalSpent: 0,
                balance: 0,
                budgets: [],
            };
            }

            groupedBudgets[year].budgets.push(budget);
            groupedBudgets[year].totalBudget += budget.totalEstimatedAmount;
        });

        for (const year in groupedBudgets) {
            groupedBudgets[year].balance = groupedBudgets[year].totalBudget - groupedBudgets[year].totalSpent;
        }

        const response = Object.values(groupedBudgets);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getBudget = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const budget = await Budget.findById(id).populate('department subDepartment itemCategory itemSubCategory item');

        if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        financialYear, department, subDepartment, itemCategory, itemSubCategory,
        item, unitPrice, quantity, productSpecification, IFTNumber, currency,
        totalEstimatedAmount, organizationId, budgetOwnerId, otherItem
    } = req.body;

    const organization = await Organization.findById(organizationId);
    if (!organization) {
        return res.status(400).json({ message: 'Organization does not exist' });
    }

    const budgetOwner = await User.findById(budgetOwnerId);
    if (!budgetOwner) {
        return res.status(400).json({ message: 'Budget Owner does not exist' });
    }

    try {
        const budget = await Budget.findByIdAndUpdate(id, {
            financialYear,
            department,
            subDepartment: subDepartment || undefined,
            itemCategory: itemCategory || undefined,
            itemSubCategory: itemSubCategory || undefined,
            organization: organization._id,
            item: item || undefined,
            unitPrice,
            quantity,
            productSpecification: productSpecification || undefined,
            IFTNumber,
            currency,
            totalEstimatedAmount,
            budgetOwner: budgetOwner!._id,
            otherItem: otherItem || undefined
        }, { new: true });

        if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteBudget = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const budget = await Budget.findByIdAndDelete(id);

        if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
