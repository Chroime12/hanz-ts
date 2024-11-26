import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { sendVerificationEmail } from "../utils/sendVerif";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body as RegisterData;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).send({ message: "Please fill all fields" });
      return;
    }

    if (!email.includes("@")) {
      res.status(400).send({ message: "Invalid email" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .send({ message: "Password must be at least 6 characters long" });
      return;
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).send({ message: "User already exists" });
      return;
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const token = generateToken(newUser._id.toString(), res);

    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      console.error("Email sending failed", emailError);
      res.status(500).send({ message: "Email sending failed" });
      return;
    }

    await newUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration failed", error);
    res.status(500).send({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ message: "Please fill all fields" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).send({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString(), res);
    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    console.error("Server error", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("jwt");
  res.send({ message: "Logged out" });
};
