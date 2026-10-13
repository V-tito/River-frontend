import LampOn from '@/icons/CP/shaded/LampOn.png';
import LampOff from '@/icons/CP/shaded/LampOff.png';
import LampError from '@/icons/CP/shaded/LampError.png';
import LampNoSurvey from '@/icons/CP/shaded/LampNoSurvey.png';
import TumblerOn from '@/icons/CP/shaded/TumblerOn.png';
import TumblerOff from '@/icons/CP/shaded/TumblerOff.png';
import TumblerError from '@/icons/CP/shaded/TumblerError.png';
import TumblerNoSurvey from '@/icons/CP/shaded/TumblerNoSurvey.png';

const icons = {
	setter: {
		//trigger: { on: triggerOn, off: triggerOff },
		tumbler: {
			on: TumblerOn,
			off: TumblerOff,
			error: TumblerError,
			disabled: TumblerNoSurvey,
		},
	},
	getter: {
		lamp: {
			on: LampOn,
			off: LampOff,
			error: LampError,
			disabled: LampNoSurvey,
		},
	},
};
export default icons;
