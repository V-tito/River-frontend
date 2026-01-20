{
    "action": "check",
    "signal": "Имя_сигнала",
    "expectedValue": "true" / "false"
}
{
    "action": "wait",
    "signal": "Имя_сигнала",
    "expectedValue": "true" / "false",
}
{
    "action": "set",
    "signal": "Имя_сигнала",
    "targetValue": "true" / "false"
}
{
    "action": "setPulse",
    "signal": "Имя_сигнала",
    "targetValue": "true" / "false"
	"pulseTime": целое число - время в миллисекундах,
	"period": целое число - время в миллисекундах (0 если нужен однократный импульс)
}
{
    "action": "preset" ,
    "signal": "Имя_сигнала",
    "targetValue": "true" / "false"
}
{
    "action": "presetPulse",
    "signal": "Имя_сигнала",
    "targetValue": "true" / "false"
	"pulseTime": целое число - время в миллисекундах,
	"period": целое число - время в миллисекундах (0 если нужен однократный импульс)
}
{
    "action": "executePresets"
}