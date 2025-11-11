import GroupOfSignals from './groupofSignals.json'
export default function handler(req, res) {
    if (req.method === 'GET') {
    let filtered = GroupOfSignals;
    
    // Apply filters based on query parameters
    if (req.query.id!==undefined) {
      filtered = filtered.filter(group => group.id == req.query.id);
    }
    if (req.query.name!==undefined) {
      filtered = filtered.filter(group => group.name == req.query.name);
    }
    if (req.query.parent_scheme_id!==undefined) {
        filtered = filtered.filter(group => group.parent_scheme_id == req.query.parent_scheme_id);
      }
    
    // Return the filtered results
    res.status(200).json(filtered);
  }};

