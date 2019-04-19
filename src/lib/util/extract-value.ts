import { ExtractableValue, IExperiment } from "../typings";

export const extractValue = <T>(value: ExtractableValue<T>, experiment: IExperiment): T => {
	return (typeof value === "function") ? (value as Function)(experiment) : value;
};