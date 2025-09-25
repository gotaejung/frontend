import Card from "./Card";
export default function Section({ title, items }) {
  return (
    <section className="bg-black py-10 px-4">
      <div className="container mx-auto">
        <h2 className="text-[32px] font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((m) => (           
            <Card key={m.id} movie={m} />
          ))}
        </div>
      </div>
    </section>
  )
}