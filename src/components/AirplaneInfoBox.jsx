export default function AirplaneInfoBox({ hex, dep_iata }) {
  if (!hex) return null;

  return (
    <div className='absolute bottom-0 left-0 bg-blue-300 p-3'>
      <div>{hex}</div>
      <div>{dep_iata}</div>
    </div>
  );
}
