import MajorProjectContainer from "./components/MajorProjectContainer";
import ShrinkingHeader from "./components/ShrinkingHeader";
import MajorProjectPreview from "./components/MajorProjectPreview";
import MinorProjectContainer from "./components/MinorProjectContainer";
import MinorProjectPreview from "./components/minorProjectPreview";

export default function Home() {
  return (
    <main className="h-screen bg-red-400">
      <ShrinkingHeader />
      <MajorProjectContainer>
        <MajorProjectPreview title="Wiki Clone" bgImg="resume main" />
        <MajorProjectPreview title="VTuber Expo" bgImg="expo main" />
        <MajorProjectPreview title="Complexity Helper" bgImg="helper main" />
        <MajorProjectPreview title="Timelines" bgImg="helper main" />
        <MajorProjectPreview title="Schedule Connection" bgImg="resume main" />
        <MinorProjectContainer>
          <MinorProjectPreview title="Seattle Colleges" bgImg="helper main" />
          <MinorProjectPreview title="GGC Mobile App" bgImg="resume main" />
          <MinorProjectPreview title="Java Guitar" bgImg="expo main" />
        </MinorProjectContainer>
      </MajorProjectContainer>
      <div className="h-24 w-full bg-blue-800"></div>
    </main>
  );
}
