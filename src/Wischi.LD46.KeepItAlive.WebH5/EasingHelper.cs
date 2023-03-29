using System;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public static class EasingHelper
    {
        public static double EaseOutSine(double x)
        {
            return Math.Sin(x * Math.PI / 2);
        }

        public static double EaseOutQuad(double x)
        {
            return 1 - (1 - x) * (1 - x);
        }

        public static double EaseOutQuint(double x)
        {
            return 1 - Math.Pow(1 - x, 5);
        }

        public static double EaseInQuad(double x)
        {
            return x * x * x * x;
        }

        public static double EaseInQuadOffset(double x)
        {
            x = x * 0.5 + 0.5;
            return x * x * x * x;
        }

        public static double EaseLinear(double x)
        {
            return x;
        }

        public static double EaseInExp(double factor)
        {
            if (factor <= 0)
            {
                return 0;
            }

            return Math.Pow(2, 10 * factor - 10);
        }
    }
}
