"use client";

import { useState } from "react";
import {
  useForm,
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
  type Path,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginFormConfig, registerFormConfig } from "@/lib/authForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  fullName: string;
  nidOrBirthCert: string;
  email: string;
  phone: string;
  password: string;
}

export default function AuthForms() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const {
    register: loginReg,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>();

  const {
    register: registerReg,
    handleSubmit: handleRegister,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>();

  const onLoginSubmit = async (data: LoginFormData) => {
    setLoading(true);
    console.log("Login Data:", data);
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    console.log("Register Data:", data);
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  };

  const renderForm = <T extends FieldValues>(
    config: typeof loginFormConfig | typeof registerFormConfig,
    reg: UseFormRegister<T>,
    errors: FieldErrors<T>
  ) => (
    <form
      onSubmit={
        activeTab === "login"
          ? handleLogin(onLoginSubmit)
          : handleRegister(onRegisterSubmit)
      }
      className="space-y-5 mt-6"
    >
      {config.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="text-sm font-medium text-gray-700 block mb-1"
          >
            {field.label}
          </label>
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            disabled={loading}
            {...reg(field.name as Path<T>, {
              required: `${field.label} প্রয়োজন`,
            })}
          />
          {errors[field.name as Path<T>] && (
            <p className="text-sm text-red-600 mt-1">
              {errors[field.name as Path<T>]?.message as string}
            </p>
          )}
        </div>
      ))}

      <Button
        type="submit"
        disabled={loading}
        className={`w-full relative flex justify-center items-center bg-[#f25b29] hover:bg-[#e5531f] text-white text-md font-semibold transition-colors duration-300 ${
          loading ? "cursor-not-allowed bg-[#d95a23]" : ""
        }`}
      >
        {!loading && (activeTab === "login" ? "লগইন করুন" : "নিবন্ধন করুন")}

        {/* Spinner */}
        {loading && (
          <span className="absolute inset-0 flex justify-center items-center">
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </span>
        )}
      </Button>
    </form>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg md:p-8 px-4 py-12 mt-24">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
        {activeTab === "login" ? "লগইন করুন" : "নিবন্ধন করুন"}
      </h2>

      <Tabs
        defaultValue="login"
        onValueChange={(val) => {
          setActiveTab(val);
          setLoading(false); // reset loading on tab switch
        }}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="login">লগইন</TabsTrigger>
          <TabsTrigger value="register">নিবন্ধন</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          {renderForm(loginFormConfig, loginReg, loginErrors)}
        </TabsContent>
        <TabsContent value="register">
          {renderForm(registerFormConfig, registerReg, registerErrors)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
