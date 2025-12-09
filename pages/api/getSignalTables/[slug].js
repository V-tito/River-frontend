
export default function handler(req,res){
const fetchGroups = async () => {
    const {slug}=req.query
    try {
      console.log("try fetching groups")
    const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/GroupOfSignals/${slug}`,{
      method: 'GET',// headers: new Headers({'Content-Type': 'application/json'})
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log("fetched groups",result)
    return result;
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({message:err.message});
  }
}
}
const fetchSignals = async (groupId)=>{
  try {
    console.log("try fetching signals")
    const response = await fetch(`${process.env.API_URL}/api/river/v1/configurator/Signal/byGroup/${groupId}`,{
      method: 'GET',// headers: new Headers({'Content-Type': 'application/json'})
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log("fetched signals",result)
    return result;
  } catch (err) {
    if (err instanceof Error) {
        res.status(500).json({message:err.message});
  }
}
}

const fetchAll=async()=>{
const newGroups=await fetchGroups()
console.log("try mapping")
if (newGroups.length>0){
const promises=newGroups.map( async (group) => {
  const temp= await fetchSignals(group.id)
  return { name:String(group.name), temp }
})
const results=await Promise.all(promises)
console.log("mapped",results)
const newData=results.reduce((acc, { name, temp }) => {
  acc[name] = temp;
  return acc;
}, {});
console.log("reduced",newData)
const newList=results.reduce((acc, { temp }) => {
  acc.push(temp);
  return acc
}, [])
res.status(200).json({data:newData,groups:newGroups,list:newList})
}
}
fetchAll();}