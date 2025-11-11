
import TestBoard from "./testBoard.json"

export default function handler(req, res) {
    if (req.method === 'GET') {
    let filtered = TestBoard;
    const {slug}=req.query
    console.log(slug)
    // Apply filters based on query parameters
    /*if (req.query.id!==undefined) {
      filtered = filtered.filter(board => board.id == req.query.id);
    }
    if (req.query.name!==undefined) {
      filtered = filtered.filter(board => board.name == req.query.name);
    }
    if (req.query.parent_scheme_id!==undefined) {
        
      }*/
    filtered = filtered.filter(board => board.parent_scheme_id == slug);
    // Return the filtered results
    res.status(200).json(filtered);
  }
  if (req.method === 'POST') {res.status(200).json("")}};