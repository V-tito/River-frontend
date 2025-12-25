export default async function handler(req, res) {
	const command = req.body;
	const act = command.action;
	if (act == 'check') {
		const api = new URL(`${process.env.API_URL}/api/river/v1/protocol/get`);
		api.searchParams.set('id', command.signal);
		try {
			const response = await fetch(api.toString(), {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});
			console.log(`tried to get state on api ${api.toString()}`);
			if (!response.ok) {
				throw new Error(
					`Ошибка сети:${
						response.message !== undefined
							? response.message
							: 'неизвестная ошибка'
					}`
				);
			}
			const result = await response.json();
			console.log('received:', result);
			console.log(Boolean(command.targetValue));
			console.log(result.b == command.targetValue);
			if (result.b == Boolean(command.targetValue))
				res
					.status(200)
					.json(
						`Уровень сигнала ${command.signal} равен эталону ${command.targetValue}`
					);
			else
				res
					.status(200)
					.json(
						`Уровень сигнала ${command.signal} НЕ равен эталону ${command.targetValue}`
					);
		} catch (err) {
			console.log('error polling ', api);
			console.log(err);
			res.status(500).json(`Ошибка: ${err.message}`);
		}
	}
	if (act == 'wait') {
		const api = new URL(`${process.env.API_URL}/api/river/v1/protocol/get`);
		api.searchParams.set('id', command.signal);
		while (true) {
			try {
				const response = await fetch(api.toString(), {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				});
				console.log(`tried to get state on api ${api.toString()}`);
				if (!response.ok) {
					throw new Error(`Ошибка сети:${response.status}`);
				}
				const result = await response.json();
				console.log('received:', result);
				if (result.b == command.targetValue)
					res
						.status(200)
						.json(
							`Уровень сигнала ${command.signal} равен эталону ${command.targetValue} в момент времени ${result.a}`
						);
				else continue;
			} catch (err) {
				console.log('error polling ', api);
				console.log(err);
				res.status(500).json(`Ошибка: ${err.message}`);
			}
		}
	}
	if (act == 'set') {
		const api = new URL(`${process.env.API_URL}/api/river/v1/protocol/set`);
		try {
			const response = await fetch(api.toString(), {
				method: 'POST',
				body: JSON.stringify({
					id: command.signal,
					currentValue: command.targetValue,
				}),
				headers: { 'Content-Type': 'application/json' },
			});
			console.log(`tried to get state on api ${api.toString()}`);
			if (!response.ok) {
				throw new Error(`Ошибка сети:${response.status}`);
			}
			res
				.status(200)
				.json(
					`Уровень сигнала ${command.signal} установлен на ${command.targetValue}`
				);
		} catch (err) {
			console.log('error polling ', api);
			console.log(err);
			res.status(500).json(`Ошибка: ${err.message}`);
		}
	}
}

/*export default async function handler(req, res) {
	// Only allow POST requests
	console.log('Request query:', req.query);
	console.log('Method:', req.method);
	console.log('URL:', req.url);

	let slug = req.query?.slug;

	// Method 2: If that fails, parse from URL path
	if (!slug || slug.includes('?')) {
		// Parse the URL path
		const url = new URL(req.url, `http://${req.headers.host}`);
		const pathParts = url.pathname.split('/').filter(Boolean);
		slug = pathParts[pathParts.length - 1]; // Last part of path
	}

	// Method 3: Clean up if it has query string attached
	if (slug && slug.includes('?')) {
		slug = slug.split('?')[0];
	}

	console.log('Resolved slug:', slug);
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
	}

	const script = req.body;
	if (!script) {
		res.status(400).json({ error: 'Script is required' });
	}
	try {
		// Set headers for Server-Sent Events (SSE)
		res.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no', // Disable proxy buffering for Nginx
			'Access-Control-Allow-Origin': '*',
		});
	} catch (err) {
		console.error('API Error:', err);

		// If headers haven't been sent yet, send normal JSON error
		if (!res.headersSent) {
			res.status(500).json({
				error: 'Internal server error',
				message: err.message,
			});
		}

		// If we already started streaming, send error as SSE
		res.write(
			`data: ${JSON.stringify({
				type: 'fatal-error',
				error: err.message,
				timestamp: new Date().toISOString(),
			})}\n\n`
		);
		res.end();
	}

	// Create a stream for real-time results
	for (let i = 0; i < script.length; i++) {
		const command = script[i];
		try {
			// Execute command
			const result = await executeCommand(command, slug);
			// Send SSE event
			res.write(
				`data: ${JSON.stringify({
					type: 'result',
					index: i,
					total: script.length,
					command: command,
					result: result,
					timestamp: new Date().toISOString(),
				})}\n\n`
			);

			// Force flush the response
			if (typeof res.flush === 'function') {
				res.flush();
			}

			// Add delay for better visualization
			if (i < script.length - 1) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
		} catch (error) {
			// Send error as SSE event
			res.write(
				`data: ${JSON.stringify({
					type: 'error',
					index: i,
					command: command,
					error: error.message,
					timestamp: new Date().toISOString(),
				})}\n\n`
			);

			if (typeof res.flush === 'function') {
				res.flush();
			}

			// Decide whether to continue or stop on error
			// break; // Uncomment to stop on first error
		}

		// Check if client disconnected
		if (req.socket.destroyed) {
			console.log('Client disconnected');
			break;
		}
	}

	// Send completion event
	res.write(
		`data: ${JSON.stringify({
			type: 'complete',
			message: 'Script execution finished',
			timestamp: new Date().toISOString(),
		})}\n\n`
	);

	// End the response
	res.end();
} */
