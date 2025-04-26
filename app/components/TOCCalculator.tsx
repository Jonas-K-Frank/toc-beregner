"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface CalculatorForm {
	purchasePrice: number;
	interestRate: number;
	operatingHours: number;
	serviceCosts: number;
	insurance: number;
	residualValue: number;
}

export default function TOCCalculator() {
	const { register, handleSubmit } = useForm<CalculatorForm>();
	const [result, setResult] = useState<{
		totalCost: number;
		costPerHour: number;
	} | null>(null);

	const onSubmit = (data: CalculatorForm) => {
		// Konverter alle input til tal (håndterer evt. string input fra browseren)
		const purchasePrice = Number(data.purchasePrice);
		const interestRate = Number(data.interestRate);
		const operatingHours = Number(data.operatingHours);
		const serviceCosts = Number(data.serviceCosts);
		const insurance = Number(data.insurance);
		const residualValue = Number(data.residualValue);

		const lifetime = 5; // år
		const restValueAmount = purchasePrice * (residualValue / 100);
		// Afskrivning
		const depreciation = (purchasePrice - restValueAmount) / lifetime;
		// Gennemsnitlig kapitalbinding
		const avgCapital = (purchasePrice + restValueAmount) / 2;
		// Renteomkostning
		const interestCost = avgCapital * (interestRate / 100);
		// Samlet årlig omkostning
		const totalAnnualCost =
			depreciation + interestCost + serviceCosts + insurance;
		// Pris pr. driftstime
		const costPerHour =
			totalAnnualCost / (operatingHours > 0 ? operatingHours : 1);

		setResult({
			totalCost: totalAnnualCost,
			costPerHour: costPerHour,
		});
	};

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md border border-[#E5E5E5]">
			<style>{`
				/* Fjern op/ned-pile fra number inputs */
				input[type=number]::-webkit-inner-spin-button,
				input[type=number]::-webkit-outer-spin-button {
					-webkit-appearance: none;
					margin: 0;
				}
				input[type=number] {
					-moz-appearance: textfield;
				}
			`}</style>
			<h2 className="text-2xl font-bold mb-8 text-[#3D3D3C]">
				Samlede ejeromkostninger
			</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
			>
				<div>
					<label className="block text-base font-semibold text-[#3D3D3C] mb-2">
						Købspris (DKK)
					</label>
					<input
						type="number"
						{...register("purchasePrice", { required: true, min: 0 })}
						className="block w-full rounded border border-[#BDBDBD] bg-white h-12 px-3 text-[#3D3D3C] text-base focus:border-[#426716] focus:ring-[#426716] outline-none"
					/>
				</div>

				<div>
					<label className="block text-base font-semibold text-[#3D3D3C] mb-2">
						Renter (% pr. år)
					</label>
					<input
						type="number"
						step="0.1"
						{...register("interestRate", { required: true, min: 0 })}
						className="block w-full rounded border border-[#BDBDBD] bg-white h-12 px-3 text-[#3D3D3C] text-base focus:border-[#426716] focus:ring-[#426716] outline-none"
					/>
				</div>

				<div>
					<label className="block text-base font-semibold text-[#3D3D3C] mb-2">
						Driftstimer pr. år
					</label>
					<input
						type="number"
						{...register("operatingHours", { required: true, min: 0 })}
						className="block w-full rounded border border-[#BDBDBD] bg-white h-12 px-3 text-[#3D3D3C] text-base focus:border-[#426716] focus:ring-[#426716] outline-none"
					/>
				</div>

				<div>
					<label className="block text-base font-semibold text-[#3D3D3C] mb-2">
						Serviceudgifter pr. år (DKK)
					</label>
					<input
						type="number"
						{...register("serviceCosts", { required: true, min: 0 })}
						className="block w-full rounded border border-[#BDBDBD] bg-white h-12 px-3 text-[#3D3D3C] text-base focus:border-[#426716] focus:ring-[#426716] outline-none"
					/>
				</div>

				<div>
					<label className="block text-base font-semibold text-[#3D3D3C] mb-2">
						Forsikring pr. år (DKK)
					</label>
					<input
						type="number"
						{...register("insurance", { required: true, min: 0 })}
						className="block w-full rounded border border-[#BDBDBD] bg-white h-12 px-3 text-[#3D3D3C] text-base focus:border-[#426716] focus:ring-[#426716] outline-none"
					/>
				</div>

				<div>
					<label className="block text-base font-semibold text-[#3D3D3C] mb-2">
						Restværdi (% af købsprisen)
					</label>
					<input
						type="number"
						step="0.1"
						{...register("residualValue", { required: true, min: 0, max: 100 })}
						className="block w-full rounded border border-[#BDBDBD] bg-white h-12 px-3 text-[#3D3D3C] text-base focus:border-[#426716] focus:ring-[#426716] outline-none"
					/>
				</div>

				<div className="md:col-span-2 flex justify-start mt-2">
					<button
						type="submit"
						className="bg-[#426716] text-white py-2 px-8 rounded hover:bg-[#365214] text-base font-semibold shadow-none"
					>
						Beregn samlede ejeromkostninger
					</button>
				</div>
			</form>

			{result && (
				<div className="mt-8 p-4 bg-gray-50 rounded-md border border-[#E5E5E5]">
					<h3 className="text-lg font-semibold mb-2 text-[#3D3D3C]">
						Resultater
					</h3>
					<p className="text-[#3D3D3C] text-base">
						Samlede årlige ejeromkostninger:{" "}
						{result.totalCost.toLocaleString("da-DK", {
							style: "currency",
							currency: "DKK",
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</p>
					<p className="text-[#3D3D3C] text-base">
						Omkostninger pr. driftstime:{" "}
						{result.costPerHour.toLocaleString("da-DK", {
							style: "currency",
							currency: "DKK",
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</p>
				</div>
			)}
		</div>
	);
}
