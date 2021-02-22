using Bridge.Html5;
using System;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class LoadingDrawer
    {
        private readonly CanvasRenderingContext2D ctx;

        public LoadingDrawer(HTMLCanvasElement canvas)
        {
            ctx = canvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
        }

        public void Draw()
        {
            ctx.FillStyle = "#B2FFFF";
            ctx.ClearRect(0, 0, 512, 512);
            ctx.FillRect(0, 0, 512, 512);

            ctx.FillStyle = "#000";
            ctx.Font = "bold 16px Arial, sans-serif";

            ctx.FillText("Loading...", 7, 20);
        }
    }

    public class TreeDrawer
    {
        private readonly CanvasRenderingContext2D ctx;
        private readonly Random rnd = new Random();

        private readonly TreeDrawingContext treeDrawingContext;
        private readonly HTMLImageElement water;
        private readonly HTMLImageElement reset;
        private readonly SharedDrawingState sharedDrawingState;

        private TreeSegment trunk;
        private RandomWrapper grassRandom;

        private const int CanvasWidth = 512;
        private const int CanvasHeight = 512;
        private const double ScaleFactor = 80;
        private const int TreeYOffset = 420;

        private string SkyColor => sharedDrawingState.IsDead ? "#444" : "#B2FFFF";
        private string GrassBackgroundColor => sharedDrawingState.IsDead ? "#333" : "#7EC850";
        private string GrassColor => sharedDrawingState.IsDead ? "#111" : "#206411";

        private int? currentSeed = null;

        public TreeDrawer(
            HTMLCanvasElement canvas,
            HTMLImageElement water,
            HTMLImageElement reset,
            SharedDrawingState sharedDrawingState
        )
        {
            this.water = water ?? throw new ArgumentNullException(nameof(water));
            this.reset = reset ?? throw new ArgumentNullException(nameof(reset));
            this.sharedDrawingState = sharedDrawingState ?? throw new ArgumentNullException(nameof(sharedDrawingState));

            canvas.Width = CanvasWidth;
            canvas.Height = CanvasHeight;

            ctx = canvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);

            treeDrawingContext = new TreeDrawingContext(ctx)
            {
                ScaleFactor = ScaleFactor,
                StartX = CanvasWidth / 2,
                StartY = TreeYOffset,
                LeafLimit = 0.02
            };
        }

        private void UpdateSeed(int newSeed)
        {
            var treeRndSource = new RandomWrapper(newSeed);
            var treeBuilder = new TreeBuilder(treeRndSource);

            trunk = treeBuilder.BuildTree();
            grassRandom = new RandomWrapper(newSeed);
        }

        private bool waterInfoWasShown = false;
        private bool waterInfoDeactivated = false;

        public void Draw()
        {
            if (sharedDrawingState.Seed != currentSeed)
            {
                UpdateSeed(sharedDrawingState.Seed);
                currentSeed = sharedDrawingState.Seed;
            }

            if (currentSeed is null)
            {
                return;
            }

            grassRandom.Reset();

            ctx.FillStyle = SkyColor;
            ctx.ClearRect(0, 0, 512, 512);
            ctx.FillRect(0, 0, 512, 512);

            treeDrawingContext.GrowthFactor = EasingHelper.EaseOutQuad(sharedDrawingState.GrowthControl * 0.75 + 0.25);
            treeDrawingContext.LeafFactor = sharedDrawingState.ThicknessControl * 0.9;
            treeDrawingContext.IsDead = sharedDrawingState.IsDead;

            var grassHeight = TreeYOffset - 50;
            ctx.FillStyle = GrassBackgroundColor;
            ctx.FillRect(0, grassHeight, CanvasWidth, CanvasHeight - grassHeight);

            var grassForegroundLimit = TreeYOffset - 20;

            for (var y = grassHeight - 10; y < grassForegroundLimit; y += 5)
            {
                DrawGrass(y, 512);
            }

            treeDrawingContext.DrawTree(trunk);

            for (var y = grassForegroundLimit; y < CanvasHeight; y += 5)
            {
                DrawGrass(y, 512);
            }

            DrawWaterHUD();
        }

        private void DrawWaterHUD()
        {
            // draw hud
            var height = 30;
            var margin = 10;
            var marginLeft = 50;
            var marginBottom = 20;
            var padding = 5;

            var waterPredition = 0;

            if (sharedDrawingState.WaterAmount + sharedDrawingState.WaterDelta > 1)
            {
                waterPredition = 1;
            }

            if (!sharedDrawingState.IsDead)
            {
                // white hud bg
                ctx.FillStyle = "#B2FFFF60";
                ctx.FillRect(0 + marginLeft, CanvasHeight - marginBottom - 2 * padding - height, CanvasWidth - margin - marginLeft, height + 2 * padding);

                ctx.FillStyle = "#0077BE80";
                ctx.FillRect(0 + marginLeft + padding, CanvasHeight - marginBottom - padding - height, (CanvasWidth - 2 * padding - margin - marginLeft) * waterPredition, height);

                ctx.FillStyle = "#0077BE";
                ctx.FillRect(0 + marginLeft + padding, CanvasHeight - marginBottom - padding - height, (int)((CanvasWidth - 2 * padding - margin - marginLeft) * sharedDrawingState.WaterAmount), height);
            }

            var icon = water;
            var iconLeft = 5;

            if (sharedDrawingState.IsDead)
            {
                iconLeft = 20;
                icon = reset;
            }

            ctx.ImageSmoothingEnabled = true;
            ctx.DrawImage(icon, iconLeft, CanvasHeight - 64 - 15, 64d, 64d);

            ctx.FillStyle = "#000";
            ctx.Font = "bold 16px Arial, sans-serif";

            var text = "";

            if (!sharedDrawingState.IsDead)
            {
                var lastWaterinfo = waterInfoWasShown;
                waterInfoWasShown = false;

                if ((sharedDrawingState.WaterAmount < 0.5 && !waterInfoDeactivated) || sharedDrawingState.WaterAmount < 0.001)
                {
                    text = "⯇ click to water your tree";
                    waterInfoWasShown = true;
                }
                else if (sharedDrawingState.WaterAmount > 0.999)
                {
                    text = "swamped";
                }

                if (lastWaterinfo && !waterInfoWasShown)
                {
                    waterInfoDeactivated = true;
                }
            }
            else
            {
                ctx.Font = "bold 24px Arial, sans-serif";
                marginLeft += 30;
                //text = "⯇ click to restart";
            }

            ctx.FillText(text, marginLeft + padding + 15, CanvasHeight - marginBottom - padding - 10);
        }

        private void DrawGrass(int y, int amount)
        {
            var grassScale = 0.2 * ScaleFactor;

            ctx.StrokeStyle = GrassColor;
            ctx.LineWidth = grassScale * 0.025;

            ctx.BeginPath();

            for (var i = 0; i < amount; i++)
            {

                var x = grassRandom.NextDouble() * CanvasWidth;

                var offsetx = grassRandom.NextDouble() - 0.5;
                var offsetY = grassRandom.NextDouble() - 0.5;
                var height = grassRandom.NextDouble() * 0.7 + 0.3;

                ctx.MoveTo(x, y + offsetY * grassScale);
                ctx.LineTo(x + offsetx * grassScale, y + offsetY * grassScale + height * grassScale);
            }

            ctx.ClosePath();
            ctx.Stroke();
        }
    }
}
