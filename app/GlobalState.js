'use client';
//import //logger from "..///logger";
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { checkExistence } from '@/utils/api_wrap/configAPI';
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
	const [navProfile, setNavProfile] = useState(() => {
		if (typeof window !== 'undefined') {
			try {
				const stored = localStorage.getItem('navProfile');
				if (stored) {
					return JSON.parse(stored);
				}
			} catch (err) {
				return null;
			}
		}
	});
	const [pollingError, setPollingError] = useState(null);
	const [schemeOn, setSchemeOn] = useState(null);
	const [defaultScheme, setDefaultScheme] = useState(() => {
		if (typeof window !== 'undefined') {
			//logger.info("Setting up default scheme")
			try {
				const storedScheme = localStorage.getItem('defaultScheme');
				if (storedScheme) {
					const parsedScheme = JSON.parse(storedScheme);
					const exists = checkExistence('Scheme', parsedScheme.name);
					//logger.info("set up default scheme from local storage",storedScheme)
					if (exists) return parsedScheme;
					else return null;
				}
			} catch (err) {
				return null;
			}
		}
	});

	useEffect(() => {
		if (defaultScheme !== null) {
			localStorage.setItem('defaultScheme', JSON.stringify(defaultScheme));
		}
	}, [defaultScheme]);
	useEffect(() => {
		if (navProfile !== null) {
			localStorage.setItem('navProfile', JSON.stringify(navProfile));
		}
	}, [navProfile]);
	useEffect(() => {
		setPollingError(null);
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				defaultScheme,
				setDefaultScheme,
				pollingError,
				setPollingError,
				navProfile,
				setNavProfile,
				schemeOn,
				setSchemeOn,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};
GlobalProvider.propTypes = {
	children: PropTypes.node,
};
export const useGlobal = () => {
	return useContext(GlobalContext);
};
