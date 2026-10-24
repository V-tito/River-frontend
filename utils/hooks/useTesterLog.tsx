import {
	useState,
	useCallback,
	useRef,
	Ref,
	RefObject,
	useEffect,
} from 'react';
import { usePersistentData } from '@/utils/hooks/usePersistentData';
export interface Result {
	id: string;
	testName: string;
	commandID: string;
	actionType: string;
	timestamp: string;
	message: string | undefined;
}
type actionType =
	| 'checkError'
	| 'setter'
	| 'wrapper'
	| 'checker'
	| 'error'
	| 'summary';
export type updateLogType = {
	setter: (msg: string, commandId: string, testName: string) => void;
	checker: (msg: string, commandId: string, testName: string) => void;
	wrapper: (msg: string, commandId: string, testName: string) => void;
	error: (msg: string, commandId: string, testName: string) => void;
	checkError: (msg: string, commandId: string, testName: string) => void;
};
export function useTesterLog() {
	const [log, setLog] = useState<Result[]>([]);
	const { saveData, loadData, clearData } = usePersistentData({
		storageKey: 'tester-log',
		storageType: 'session',
	});
	//so i can change format if needed
	const saveLog = useCallback(() => {
		saveData(log);
	}, [log]);

	const loadLog = useCallback(() => {
		const data = loadData();
		if (data) {
			setLog(data);
		}
	}, []);
	const clearLog = useCallback(() => {
		clearData();
	}, [clearData]);

	useEffect(() => {
		loadLog();
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			saveLog();
		}, 500);
		return () => clearTimeout(timeoutId);
	}, []);
	//it'd be good to make msg in here as well; but it's formed depending on the Command's contents, so eh.
	const makeResult = (
		msg: string,
		actionType: actionType,
		commandId: string,
		testName: string
	) => {
		const now = new Date();
		return {
			message: msg,
			timestamp: now.toLocaleTimeString(),
			actionType: actionType,
			testName: testName,
			id: crypto.randomUUID(),
			commandID: commandId,
		} as Result;
	};
	const appendResultToLog = (
		msg: string,
		actionType: string,
		id: string,
		testName: string
	) => {
		const res = makeResult(msg, actionType as actionType, id, testName);
		setLog(prev => [...prev, res]);
	};
	const updateLog = {
		setter: (msg: string, commandId: string, testName: string) =>
			appendResultToLog(msg, 'setter', commandId, testName),
		checker: (msg: string, commandId: string, testName: string) =>
			appendResultToLog(msg, 'checker', commandId, testName),
		wrapper: (msg: string, commandId: string, testName: string) =>
			appendResultToLog(msg, 'wrapper', commandId, testName),
		error: (msg: string, commandId: string, testName: string) =>
			appendResultToLog(msg, 'error', commandId, testName),
		checkError: (msg: string, commandId: string, testName: string) =>
			appendResultToLog(msg, 'checkError', commandId, testName),
	};
	const stringifyResult = (val: Result) => {
		return '[' + val.testName + '] ' + val.timestamp + ': ' + val.message;
	};
	const stringifyLog = () => {
		return log.map(stringifyResult).reduce((acc, item) => {
			return acc + item + '\n';
		}, '');
	};
	return { log, appendResultToLog, updateLog, stringifyResult, stringifyLog };
}
