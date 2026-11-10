export default function SetElementSize({ defauult, reset }) {
	const { reset, resetDefaultValues, register } = useForm({
		defaultValues: { side: defauult },
	});
	useEffect(() => {
		resetDefaultValues({ side: defauult });
		reset();
	}, [defauult]);
	return (
		<div className={styles.setsize}>
			<label>
				Размер
				<input
					type="number"
					{...register('side')}
					onChange={e => reset(e.target.value)}
				/>
			</label>
		</div>
	);
}
