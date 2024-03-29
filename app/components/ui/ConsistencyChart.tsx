"use client";
import Calendar from "react-github-contribution-calendar";
import { useTheme } from "next-themes";
import { Scrawl } from "@prisma/client";
import { FC } from "react";
import { YYYYMMDD } from "@/app/lib/dayJs";

type AccumulatorType = {
	[key: string]: number;
};

export const ConsistencyChart: FC<{
	scrawls: Scrawl[];
}> = ({ scrawls }) => {
	const { theme } = useTheme();
	const weekNames = ["", "M", "", "W", "", "F", ""];

	const values = scrawls.reduce<AccumulatorType>((acc, scrawl) => {
		const key = YYYYMMDD(scrawl.completedAt);
		acc[key] = scrawl.snoozedCount + 1;
		return acc;
	}, {});

	const wordsWritten = scrawls.reduce((acc, scrawl) => {
		return acc + scrawl.wordCount;
	}, 0);

	const until = new Date().toDateString();
	const panelAttributes = {
		rx: 2,
		ry: 2,
		style: {
			stroke: theme === "dark" ? "#222222" : "#b0b0b0",
			strokeWidth: 0.5,
		},
	};
	const weekLabelAttributes = {
		style: {
			fontSize: 10,
			margin: "0 10px",
			fill: theme === "dark" ? "#d0d0d0" : "#151414",
		},
	};
	const monthLabelAttributes = {
		style: {
			fontSize: 10,
			fill: theme === "dark" ? "#d0d0d0" : "#151414",
		},
	};

	const darkPanelColors = ["#111", "#1E8C34", "#26A641", "#39D353"];
	const lightPanelColors = ["#b0b0b0", "#40c463", "#30a14e", "#26A641"];

	return (
		<section className="flex flex-col gap-2 ">
			<p className=" font-semibold text-background dark:text-textDark">
				{scrawls.length} contribution(s) in the last year
			</p>
			<section className="!-mr-2">
				<Calendar
					values={values}
					until={until}
					panelAttributes={panelAttributes}
					weekLabelAttributes={weekLabelAttributes}
					monthLabelAttributes={monthLabelAttributes}
					panelColors={theme === "dark" ? darkPanelColors : lightPanelColors}
					weekNames={weekNames}
				/>
			</section>
			<p className="ml-auto font-semibold text-background dark:text-textDark text-xs">
				Words: {wordsWritten || 0}
			</p>
		</section>
	);
};
