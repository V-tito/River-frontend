
import signals from './signals.json'
export default function handler(req, res) {
    if (req.method === 'GET') {  
    let filtered = signals;
    // Apply filters based on query parameters
    if (req.query.id!==undefined) {
      filtered = filtered.filter(signal => signal.id == req.query.id);
    }
    if (req.query.name!==undefined) {
      filtered = filtered.filter(signal => signal.name == req.query.name);
    }
    if (req.query.parent_board_id!==undefined) {
        filtered = filtered.filter(signal => signal.parent_board_id == req.query.parent_board_id);
      }
    if (req.query.parent_group_id!==undefined) {
        filtered = filtered.filter(signal => signal.parent_group_id == req.query.parent_group_id);
      }
    if (req.query.is_output!==undefined) {
        filtered = filtered.filter(signal => signal.is_output == req.query.is_output);
      }
      if (req.query.is_straight!==undefined) {
        filtered = filtered.filter(signal => signal.is_straight == req.query.is_straight);
      }
    if (req.query.channel!==undefined) {
        filtered = filtered.filter(signal => signal.channel == req.query.channel);
      }
    
    
    // Return the filtered results
    res.status(200).json(filtered);
  }};
