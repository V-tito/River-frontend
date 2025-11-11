import scheme_ from './testScheme.json'

export default function handler(req, res) {
    if (req.method === 'GET') {
  let filtered = scheme_;

  // Apply filters based on query parameters
  if (req.query.id!==undefined) {
    filtered = filtered.filter(scheme => scheme.id == req.query.id);
  }
  if (req.query.name!==undefined) {
    filtered = filtered.filter(scheme => scheme.name == req.query.name);
  }
  
  // Return the filtered results
  res.status(200).json(filtered);
}};