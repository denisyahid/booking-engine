import AccordionItem from "../../Elements/AccordionItem";

const Accordion = () => {
    return (
         <div>
                <h2 className='text-xl font-bold mb-4'>Hotel Features</h2>
                <AccordionItem title='Fast Check-in / Check-Out' />
                <AccordionItem title='Free Self Parking for Cars' />
                <AccordionItem title='Site Seeing Tours' />
            </div>
    )
}

export default Accordion;