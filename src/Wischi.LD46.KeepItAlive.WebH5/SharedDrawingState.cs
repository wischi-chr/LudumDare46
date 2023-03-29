namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class SharedDrawingState
    {
        public double GrowthControl { get; set; }
        public double WaterAmount { get; set; }
        public double ThicknessControl { get; set; }
        public double WaterDelta { get; set; }
        public bool IsDead { get; set; }
        public int Seed { get; set; }
    }
}
