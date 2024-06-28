import { Request, Response } from 'express';
import BudgetFileTemplate from '../models/BudgetFileTemplate';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/budgettemp/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({ storage });

export const uploadBudgetFileTemplate = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const budgetFileTemplate = new BudgetFileTemplate({
            filename: file.filename,
            filepath: file.path,
            organization: req.user!.organization
        });

        await budgetFileTemplate.save();
        res.status(201).json({success: true, data: budgetFileTemplate, message: "File Added Successfully"});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllBudgetFileTemplates = async (req: AuthenticatedRequest, res: Response) => {
    console.log("ORGANIZATION ID: ", req.user!.organization)
    try {
        const budgetFileTemplates = await BudgetFileTemplate.find({ organization: req.user!.organization });
        res.status(200).json({success: true, data: budgetFileTemplates});
    } catch (error) {
        console.log("ERROR ADDING BUDGET TEMPLATE", error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateBudgetFileTemplate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const budgetFileTemplate = await BudgetFileTemplate.findById(id);
        if (!budgetFileTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Delete the old file
        fs.unlinkSync(budgetFileTemplate.filepath);

        budgetFileTemplate.filename = file.filename;
        budgetFileTemplate.filepath = file.path;
        budgetFileTemplate.uploadedAt = new Date();

        await budgetFileTemplate.save();
        res.status(200).json(budgetFileTemplate);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteBudgetFileTemplate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const budgetFileTemplate = await BudgetFileTemplate.findById(id);
        if (!budgetFileTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Delete the file
        fs.unlinkSync(budgetFileTemplate.filepath);

        await BudgetFileTemplate.deleteOne({ _id: id });
        res.status(200).json({ message: 'Template deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
