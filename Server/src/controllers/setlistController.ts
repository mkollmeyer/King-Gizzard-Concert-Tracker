import { Setlist } from "../models/setlistModel.ts";
import { type Request, type Response } from 'express';

const handleResponse = (res: Response, status: number, message: string, data: any = null) => {
    res.status(status).json({
        status,
        message,
        data
    })
};
export const createSet = async(req: Request, res: Response, next: Function) => {
    const id = req.body.id as string;
    console.log(id);
    try {
        const newSet = await Setlist.insertOne({
            id: id,
            songs: 0,
            cities: {},
            numofSongs: {}
        });
        handleResponse(res, 201, "Setlist created", newSet);
    } catch (err){
        next(err);
    }
};
export const getAllSet = async(req: Request, res: Response, next: Function) => {
    try {
        const Sets = await Setlist.find();
        handleResponse(res, 200, "Setlists retrieved", Sets);
    } catch (err){
        next(err);
    }
};
export const getSetById = async(req: Request, res: Response, next: Function) => {
    try {
        const Set = await Setlist.findOne({ id: req.params.id as string });
        if(!Set) return handleResponse(res, 404, "Setlist not found");
        handleResponse(res, 200, "Setlist retrieved", Set);
    } catch (err){
        next(err);
    }
};
export const updateSet = async(req: Request, res: Response, next: Function) => {
    const {songlist, city} = req.body;
    try {
        const updatedSet = await Setlist.findByIdAndUpdate(req.params.id, {
            cities: {
                ...req.body.cities,
                [city]: (req.body.cities[city] || 0) + songlist.length
            },
            songs: (req.body.songs || 0) + songlist.length
        });
        if(!updatedSet) return handleResponse(res, 404, "Setlist not found");
        handleResponse(res, 200, "Setlist updated", updatedSet);
    } catch (err){
        next(err);
    }
};
export const deleteSet = async(req: Request, res: Response, next: Function) => {
    try {
        const deletedSet = await Setlist.findByIdAndDelete(req.params.id);
        if(!deletedSet) return handleResponse(res, 404, "Setlist not found")
        handleResponse(res, 200, "Setlist deleted", deletedSet)
    } catch (err){
        next(err);
    }
};