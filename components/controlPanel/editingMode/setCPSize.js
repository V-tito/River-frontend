export default function SetCPSize(x, setX, y, setY) {
	return (
		<div>
			<label>
				Ширина
				<input type="number" value={x} onChange={e => setX(e.target.value)} />
			</label>
			<label>
				Высота
				<input type="number" value={y} onChange={e => setY(e.target.value)} />
			</label>
		</div>
	);
}
