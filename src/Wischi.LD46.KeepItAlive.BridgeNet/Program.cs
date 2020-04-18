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
            var input = new HTMLInputElement
            {
                Type = InputType.Range,
                Min = "1",
                Max = "1000",
                Value = "1000"
            };

            Document.Body.AppendChild(canvas);
            Document.Body.AppendChild(input);

            var app = new App(canvas);

            input.AddEventListener(EventType.Input, () =>
            {
                var growth = int.Parse(input.Value) / 1000.0;
                app.SetGrowState(growth);
            });
        }
    }
}
