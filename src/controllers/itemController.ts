import { Request, Response } from 'express';
import Item from '../models/Item';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createItem = async (req: Request, res: Response) => {
    const { name, description, categoryId, subCategoryId, organizationId } = req.body;

    try {
        const item = await Item.create({
            name,
            description,
            category: categoryId || undefined,
            subCategory: subCategoryId || undefined,
            organization: organizationId
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createItemsInBulk = async (req: Request, res: Response) => {
    const items = req.body.items;

    if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'Invalid data format. "items" should be an array.' });
    }

    try {
        const createdItems = await Item.insertMany(items);
        res.status(201).json({success: true, data: createdItems, message: 'Item(s) Created Successfully'});
    } catch (error) {
        console.log("ERROR ADDING ITEM", error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const getItems = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const items = await Item.find({ organization: req.user!.organization }).populate('category subCategory organization');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, categoryId, subCategoryId } = req.body;

    try {
        const item = await Item.findByIdAndUpdate(id, { name, description, category: categoryId || undefined, subCategory: subCategoryId || undefined }, { new: true });

        if (!item) {
        return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const item = await Item.findByIdAndDelete(id);

        if (!item) {
        return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
