import express from "express"
import {login,signup,logout} from "../controllers/authController"

const router=express.Router();

router.get("/login",login);
router.post("/signup",signup);
router.get("/logout",logout);

export default router;

