import AnalogClock from "@/components/AnalogClock";
import DigitalClock from "@/components/DigitalClock";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1, // fill available space from layout
      width: '100%',
      gap: '4rem', // Better visual separation
    }}>
      <PageTransition>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4rem' }}>
          <AnalogClock />
          <DigitalClock />
        </div>
      </PageTransition>
    </main>
  );
}
