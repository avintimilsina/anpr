import { LuFacebook, LuInstagram, LuLinkedin, LuTwitter } from "react-icons/lu";
import { type ProcessImage } from "@/components/cards/step";

export const SOCIALS = [
	{
		label: "Twitter",
		href: "https://twitter.com/",
		icon: LuTwitter,
	},
	{
		label: "Facebook",
		href: "https://facebook.com",
		icon: LuFacebook,
	},
	{
		label: "LinkedIn",
		href: "https://linkedin.com/",
		icon: LuLinkedin,
	},
	{
		label: "Instagram",
		href: "https://instagram.com/",
		icon: LuInstagram,
	},
];

export const STEPS: { label: number; text: string; image: ProcessImage }[] = [
	{ label: 1, text: "Register with ParkSathi", image: "register" },
	{ label: 2, text: "Setup vehicle details", image: "vehicle" },
	{ label: 3, text: "Park in any of our parking spots", image: "parking" },
	{ label: 4, text: "Get bills by minute in our app", image: "payment" },
];

export const REVIEWS = [
	{
		rating: 5,
		content:
			"This app is a game-changer! Effortlessly find and secure parking spots. User-friendly interface and advance reservations make city parking stress-free. Kudos to the developers for creating such a convenient and efficient solution!",
		author: "Abin Timilsina",
	},
	{
		rating: 5,
		content:
			"Automatic parking has transformed my city life. Real-time availability and automated processes save time. A must-have for urbanites seeking convenience and efficiency.",
		author: "Kritika Sharma",
	},
	{
		rating: 5,
		content:
			"Seamless from start to finish. Precision in navigation and parking is impressive. Enjoyable and stress-free, with the added bonus of extending parking with a simple tap. Delighted user, can't imagine going back to traditional hassles!",
		author: "Ruza Kansakar",
	},
];

export const CITIES = [
	{
		image: "/assets/places/chhayacenter.jpg",
		name: "Chhaya Center Parking",
		address: "Thamel, Kathmandu",
		ambience: "BUSY",
		distance: 1200,
		rating: 4.2,
	},
	{
		image: "/assets/places/dharahara.jpg",
		name: "Dharahara Parking",
		address: "Sundhara, Kathmandu",
		ambience: "NOISY",
		distance: 4200,
		rating: 3.5,
	},
	{
		image: "/assets/places/civilmall.jpg",
		name: "Civil Mall Parking",
		address: "Sundhara, Kathmandu",
		ambience: "QUIET",
		distance: 3000,
		rating: 4.1,
	},
	{
		image: "/assets/places/bhatbhateni.jpeg",
		name: "Bhatbhateni",
		address: "Radhe Radhe, Bhaktapur",
		ambience: "QUIET",
		distance: 6000,
		rating: 4.9,
	},
	{
		image: "/assets/places/skytower.jpg",
		name: "Sky Tower Parking",
		address: "Kamaladi, Kathmandu",
		ambience: "QUIET",
		distance: 7200,
		rating: 4.4,
	},
	{
		image: "/assets/places/lakeside.jpeg",
		name: "Lake View Parking",
		address: "Lakeside, Pokhara",
		ambience: "QUIET",
		distance: 5000,
		rating: 4.8,
	},
];
