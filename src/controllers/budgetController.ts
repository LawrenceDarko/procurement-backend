import { Request, Response } from 'express';
import Budget from '../models/Budget';
import Organization from '../models/Organization';

export const createBudget = async (req: Request, res: Response) => {
    const {
        financialYear, department, subDepartment, itemCategory, itemSubCategory,
        item, unitPrice, quantity, productSpecification, IFTNumber, currency,
        totalEstimatedAmount, organizationId
    } = req.body;

    const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(400).json({ message: 'Organization does not exist' });
        }

    try {
        const budget = await Budget.create({
            financialYear,
            department,
            subDepartment: subDepartment || undefined,
            itemCategory,
            itemSubCategory: itemSubCategory || undefined,
            organization: organization._id,
            item,
            unitPrice,
            quantity,
            productSpecification,
            IFTNumber,
            currency,
            totalEstimatedAmount,
        });

        res.status(201).json({success: true, data: budget, message: 'Budget Created Successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createBudgetsInBulk = async (req: Request, res: Response) => {
    const budgets = req.body.budgets;

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

export const getBudgets = async (req: Request, res: Response) => {
    try {
        const budgets = await Budget.find().populate('department subDepartment itemCategory itemSubCategory item');
        res.status(200).json(budgets);
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
        totalEstimatedAmount, organizationId
    } = req.body;

    const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(400).json({ message: 'Organization does not exist' });
        }

    try {
        const budget = await Budget.findByIdAndUpdate(id, {
            financialYear,
            department,
            subDepartment: subDepartment || undefined,
            itemCategory,
            itemSubCategory: itemSubCategory || undefined,
            organization: organization._id,
            item,
            unitPrice,
            quantity,
            productSpecification,
            IFTNumber,
            currency,
            totalEstimatedAmount,
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
