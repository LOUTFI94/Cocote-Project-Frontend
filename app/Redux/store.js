"use client";
import { configureStore } from "@reduxjs/toolkit";
import LikesReducer from "./LikesReducer";

export default configureStore({
    reducer:{
        likes:LikesReducer
    }
})