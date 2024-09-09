// import original module declarations
import "styled-components/native";

// and extend them!
declare module "styled-components/native" {
  export interface DefaultTheme {
    mainBgColor: string;
    textColor: string;
    blackColor: string;
    whiteColor: string;
    grayColor: string;
    grayBackground: string;
    grayInactColor: string;
    grayLineColor: string;
    greenActColor: string;
    greenInactColor: string;
    greenTextColor: string;
    baseMargin: string;
    size4: string;
    size8: string;
    size12: string;
    size16: string;
    size20: string;
    size24: string;
  }
}
