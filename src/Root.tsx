import "./lib/fonts";
import { Composition } from "remotion";
import { Test, TEST_DURATION } from "./videos/Test/Test";
import { ShopSpot, SHOPSPOT_DURATION } from "./videos/ShopSpot/ShopSpot";
import { LateNight, LATENIGHT_DURATION } from "./videos/LateNight/LateNight";

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
      <Composition
        id="ShopSpot"
        component={ShopSpot}
        durationInFrames={SHOPSPOT_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LateNight"
        component={LateNight}
        durationInFrames={LATENIGHT_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
