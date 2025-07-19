import express from "express"

const router=express.Router();

router.get("/login",login);
router.post("/signup",signup);
router.get("/logout",logout);

export default router;

