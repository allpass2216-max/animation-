import "./lib/fonts";
import { Composition } from "remotion";
import { Test, TEST_DURATION } from "./videos/Test/Test";
import { ShopSpot, SHOPSPOT_DURATION } from "./videos/ShopSpot/ShopSpot";
import { LateNight, LATENIGHT_DURATION } from "./videos/LateNight/LateNight";
import { DinnerSecret, DINNERSECRET_DURATION } from "./videos/DinnerSecret/DinnerSecret";
import { AiCrore, AICRORE_DURATION } from "./videos/AiCrore/AiCrore";
import { AiCrore2, AICRORE2_DURATION } from "./videos/AiCrore2/AiCrore2";
import { OyoSecret, OyoSecretToon, OYOSECRET_DURATION } from "./videos/OyoSecret/OyoSecret";
import { RotiBeej, RotiBeejAnime, ROTIBEEJ_DURATION } from "./videos/RotiBeej/RotiBeej";
import { AnimeTest, ANIMETEST_DURATION } from "./videos/AnimeTest/AnimeTest";
import { JaaduRubber, JAADURUBBER_DURATION } from "./videos/JaaduRubber/JaaduRubber";
import { TankiRassi, TankiRassiGolden, TANKIRASSI_DURATION } from "./videos/TankiRassi/TankiRassi";
import { SavannaTest, SAVANNA_DURATION } from "./videos/SavannaTest/SavannaTest";
import { SajdaRaat, SAJDARAAT_DURATION } from "./videos/SajdaRaat/SajdaRaat";
import { FreeEditor, FREEEDITOR_DURATION } from "./videos/FreeEditor/FreeEditor";

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
      <Composition
        id="DinnerSecret"
        component={DinnerSecret}
        durationInFrames={DINNERSECRET_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiCrore"
        component={AiCrore}
        durationInFrames={AICRORE_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiCrore2"
        component={AiCrore2}
        durationInFrames={AICRORE2_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OyoSecret"
        component={OyoSecret}
        durationInFrames={OYOSECRET_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OyoSecretToon"
        component={OyoSecretToon}
        durationInFrames={OYOSECRET_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RotiBeej"
        component={RotiBeej}
        durationInFrames={ROTIBEEJ_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AnimeTest"
        component={AnimeTest}
        durationInFrames={ANIMETEST_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RotiBeejAnime"
        component={RotiBeejAnime}
        durationInFrames={ROTIBEEJ_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JaaduRubber"
        component={JaaduRubber}
        durationInFrames={JAADURUBBER_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TankiRassi"
        component={TankiRassi}
        durationInFrames={TANKIRASSI_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SavannaTest"
        component={SavannaTest}
        durationInFrames={SAVANNA_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TankiRassiGolden"
        component={TankiRassiGolden}
        durationInFrames={TANKIRASSI_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SajdaRaat"
        component={SajdaRaat}
        durationInFrames={SAJDARAAT_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FreeEditor"
        component={FreeEditor}
        durationInFrames={FREEEDITOR_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
