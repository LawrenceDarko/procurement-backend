import { Request, Response } from 'express';
import Budget from '../models/Budget';
import Organization from '../models/Organization';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import User from '../models/User';

export const createBudget = async (req: AuthenticatedRequest, res: Response) => {
    const {
        financialYear, department, subDepartment, itemCategory, itemSubCategory,
        item, unitPrice, quantity, productSpecification, IFTNumber, currency,
        totalEstimatedAmount, organizationId, budgetOwnerId, otherItem
    } = req.body;

    const isLocked = await Budget.exists({organization: req.user!.organization, financialYear, budgetIsLocked: true });

    if (isLocked) {
        return res.status(403).json({ message: `Budget year ${financialYear} is locked` });
    }

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

export const createBudgetsInBulk = async (req: AuthenticatedRequest, res: Response) => {
    const budgets = req.body;

    if (!Array.isArray(budgets)) {
        return res.status(400).json({ message: 'Invalid data format. "budgets" should be an array.' });
    }

    const financialYears = budgets.map((budget: any) => budget.financialYear);

    const lockedYears = await Budget.find({ organization: req.user!.organization, financialYear: { $in: financialYears }, budgetIsLocked: true });

    if (lockedYears.length > 0) {
        return res.status(403).json({ message: `One or more budget years are locked` });
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

export const updateBudget = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const {
        financialYear, department, subDepartment, itemCategory, itemSubCategory,
        item, unitPrice, quantity, productSpecification, IFTNumber, currency,
        totalEstimatedAmount, organizationId, budgetOwnerId, otherItem, budgetStatus
    } = req.body;

    const isLocked = await Budget.exists({organization: req.user!.organization, financialYear, budgetIsLocked: true });

    if (isLocked) {
        return res.status(403).json({ message: `Budget year ${financialYear} is locked and cannot be edited. Consult your Supervisor.` });
    }

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
            otherItem: otherItem || undefined,
            budgetStatus
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

export const lockBudgetYear = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { year } = req.params;
        await Budget.updateMany({ organization: req.user!.organization, financialYear: year }, { $set: { budgetIsLocked: true } });
        res.status(200).json({ message: `Budget year ${year} locked successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const unlockBudgetYear = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { year } = req.params;
        await Budget.updateMany({ organization: req.user!.organization, financialYear: year }, { $set: { budgetIsLocked: false } });
        res.status(200).json({ message: `Budget year ${year} unlocked successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
