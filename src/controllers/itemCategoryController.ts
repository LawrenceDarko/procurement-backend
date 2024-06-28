import { Request, Response } from 'express';
import ItemCategory from '../models/ItemCategory';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import ItemSubCategory from '../models/ItemSubCategory';
import Item from '../models/Item';

export const createItemCategory = async (req: Request, res: Response) => {
    const { name, description, organizationId } = req.body;

    try {
        const itemCategory = await ItemCategory.create({
        name,
        description,
        organization: organizationId
        });

        res.status(201).json(itemCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getItemCategories = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const itemCategories = await ItemCategory.find({ organization: req.user!.organization }).populate('organization');
        res.status(200).json(itemCategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateItemCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const itemCategory = await ItemCategory.findByIdAndUpdate(id, { name, description }, { new: true });

        if (!itemCategory) {
        return res.status(404).json({ message: 'Item category not found' });
        }

        res.status(200).json(itemCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteItemCategory = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {

        const isCategorytHavingSubCategoryUnderIt = await ItemSubCategory.find({ organization: req.user!.organization, category: id });

        const isCategoryHavingItemsUnderIt = await Item.find({ organization: req.user!.organization, category: id })

        if(isCategorytHavingSubCategoryUnderIt.length > 0 || isCategoryHavingItemsUnderIt.length > 0){
            return res.status(401).json({ message: "Not allowed. Category is having Sub-category or Items"})
        }
        
        const itemCategory = await ItemCategory.findByIdAndDelete(id);

        if (!itemCategory) {
        return res.status(404).json({ message: 'Item category not found' });
        }

        res.status(200).json({ message: 'Item category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
