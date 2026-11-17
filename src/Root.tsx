import "./lib/fonts";
import { Composition } from "remotion";
import { Test, TEST_DURATION } from "./videos/Test/Test";

// Register every video here. One folder per video in src/videos/<name>/.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Test"
        component={Test}
        durationInFrames={TEST_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
