using Bridge;
using Bridge.Html5;
using System;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class Program
    {
        private static HTMLCanvasElement canvas;

        [Ready]
        public static void Main()
        {
            canvas = new HTMLCanvasElement();

            var inputGrowth = new HTMLInputElement
            {
                Type = InputType.Range,
                Min = "0",
                Max = "1000",
                Value = "0"
            };

            var inputWater = new HTMLInputElement
            {
                Type = InputType.Range,
                Min = "0",
                Max = "1000",
                Value = "1000"
            };

            Document.Body.AppendChild(canvas);
            Document.Body.AppendChild(inputGrowth);
            Document.Body.AppendChild(inputWater);

            var water = new HTMLImageElement() { Src = "img/water.png" };

            var app = new App(canvas, water);

            water.AddEventListener(EventType.Load, () =>
            {
                Update();
            });

            void Update()
            {
                app.GrowthControl = int.Parse(inputGrowth.Value) / 1000.0;
                app.ThicknessControl = int.Parse(inputWater.Value) / 1000.0;

                app.Redraw();
            }

            inputGrowth.AddEventListener(EventType.Input, Update);
            inputWater.AddEventListener(EventType.Input, Update);

            var redrawTimer = Window.SetInterval(() =>
            {
                app.Redraw();
            }, 100);


            var treeBehaviour = new TreeBehaviourEngine();

            var tickTimer = Window.SetInterval(() =>
            {
                treeBehaviour.Tick();
                app.GrowthControl = treeBehaviour.Growth;
            }, 10);
        }
    }

    public class TreeBehaviourEngine
    {
        // If the tree grows under perfect conditions
        // it's finished after almost 2 years (with a tick duration of 15 min)

        private readonly double maxGrowthRate = 0.000015; // growth per tick
        private readonly RandomWrapper rndSource;

        public TreeBehaviourEngine()
            : this(1, 0.3, 0)
        {
        }

        public TreeBehaviourEngine(double health, double waterLevel, double growth)
        {
            Health = health;
            Growth = growth;
            WaterLevel = waterLevel;
            DeltaWater = 0.125;

            rndSource = new RandomWrapper();
        }

        public double DeltaWater { get; private set; }
        public double WaterLevel { get; private set; }
        public double Health { get; private set; }
        public double Growth { get; private set; }

        public void Water()
        {
            WaterLevel += DeltaWater;
        }

        public void Tick()
        {

        }
    }
}
