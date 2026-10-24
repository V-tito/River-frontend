import type { Command } from '@/utils/hooks/command/command';
import { EditorTab } from '../editorTabHooks/utils';
import {
	CommandAction,
	commandTypeCheckers,
} from '@/utils/hooks/command/command';
function hasEmptyFields(command: Command) {
	console.debug('command in hasEmptyFields', command);
	let res = command.action == CommandAction.none;
	if (commandTypeCheckers.isSignalCommand(command))
		res = res || command.group == '' || command.signal == '';
	if (commandTypeCheckers.isInclude(command))
		res = res || command.scriptPath == '';
	if (commandTypeCheckers.isLoop(command))
		res = res || command.loopContent.length == 0;
	return res;
}
function entryHasEmptyFields(entry: EditorTab) {
	console.debug('entry in entryHasEmptyFields', entry);
	entry.content.reduce((acc, command) => {
		console.debug(
			'command in tab being processed in etry has empty fields',
			command
		);
		return acc || hasEmptyFields(command);
	}, false);
}
