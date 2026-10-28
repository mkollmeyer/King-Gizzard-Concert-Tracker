import { Setlist, type show } from "../models/setlistModel.ts";
import { type Request, type Response } from 'express';
import dotenv from 'dotenv'

dotenv.config();

const handleResponse = (res: Response, status: number, message: string, data: any = null) => {
    res.status(status).json({
        status,
        message,
        data
    })
};

export const get_setlists = async(req: Request, res: Response, next: Function) => {
    try {
        const ref = await fetch(`https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=f58384a4-2ad2-4f24-89c5-c7b74ae1cce7&date=${req.params.date}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'x-api-key': process.env.API_KEY as string
            }
        });
        if (!ref.ok) {
            throw new Error(`HTTP error! status: ${ref.status}`);
        }
        const resp = await ref.json();
        const show: show = {
            city: resp.setlist[0].venue.city.name,
            num_songs: resp.setlist[0].sets.set[0].song.length,
            setlist: resp.setlist[0].sets.set[0].song.map((song: any) => song.name)
        };
        handleResponse(res, 200, "Setlist found", show);
    } catch (err){
        next(err);
    }
};

export const createSet = async(req: Request, res: Response, next: Function) => {
    const id = req.body.id as string;
    console.log(id);
    try {
        const newSet = await Setlist.insertOne({
            id: id,
            songs: {},
            cities: {},
            numofSongs: 0
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
    const id = req.params.id as string;
    try {
        const updatedSet = await Setlist.findOne({ id: id }, {
            cities: req.body.city,
            songs: req.body.setlist,
            numofSongs: req.body.num_songs
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