// src/components/ui/AuthInitializer.tsx
"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "@/redux/features/auth/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return null;
}