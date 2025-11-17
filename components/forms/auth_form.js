// components/Form.js
"use client";
import React, { useState } from "react";
import styles from "./form.module.css"; // Updated import path

const Form = () => {
    const [formData, setFormData] = useState({
        login: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value} = e.target;
            setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
      
        try {
            const response = await fetch(`${process.env.API_URL}/api/data`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData)
            });
      
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const result = await response.json();
            console.log('Success:', result);
          } catch (error) {
            console.error('Error:', error);
          }
        };
        
    const handleReset = (e)=>{
        e.preventDefault();
        setFormData({
            login: "",
            password: "",
        })
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
            <label htmlFor="login" className={styles.label}>
                login:
            </label>
            <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                className={styles.input} 
                required/>

            <label htmlFor="password" className={styles.label}>
                password 
                <button
                    type="hide-pass-button"
                    onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? ' (Hide)' : ' (Show)'}
                </button>:
            </label>
            <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input} 
                required
                />
            <button type="submit" className={styles.button}>
                Submit
            </button>
            <button type="reset" className={styles.button}>
                Reset
            </button>
        </form>
    );
};

export default Form;