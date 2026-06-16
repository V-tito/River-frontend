export const netError = (response, messag = null, entity = null) =>
	new Error(
		`Ошибка сети  ${response.status} ${messag}: ${
			'message' in response
				? response.message
				: response.status == 500
					? 'внутренняя ошибка сервера'
					: response.status == 409
						? 'неправильно заполнена форма'
						: response.status == 404
							? `сущность ${entity ? entity : ''} не найдена`
							: 'неизвестная ошибка'
		}`
	);
