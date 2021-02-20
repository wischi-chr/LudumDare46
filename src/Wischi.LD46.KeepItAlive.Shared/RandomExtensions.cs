namespace Wischi.LD46.KeepItAlive
{
    public static class RandomExtensions
    {
        public static double UniformRandom(this IRandomSource randomSource, double lowerLimit, double upperLimit)
        {
            var delta = (upperLimit - lowerLimit);
            var randAmount = randomSource.NextDouble() * delta;
            return lowerLimit + randAmount;
        }
    }
}
