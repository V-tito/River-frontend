import OpenLocalFileModal from '../modals/openLocalFileModal';
function UploadFileModal({ folder }) {
	const handleFileUpload = async (e, file) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('file', file);
		const response = await fetch(`/api/files?folder=${folder}`, {
			method: 'POST',
			body: formData,
		});

		if (response.ok) {
		} else {
		}
		window.location.reload();
	};
	return (
		<OpenLocalFileModal
			uploadAction={handleFileUpload}
			label="Загрузить файл"
		></OpenLocalFileModal>
	);
}
export default UploadFileModal;
