import type { Metadata } from 'next';
import React from 'react';
//import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import LeftSidebar from '../components/leftSidebar';
import { GlobalProvider } from './GlobalState';

/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});*/

export const metadata: Metadata = {
	title: 'River Project',
	description: 'Программа тестирования СУЛ',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body>
				<GlobalProvider>
					<LeftSidebar>{children}</LeftSidebar>
				</GlobalProvider>
			</body>
		</html>
	);
}
