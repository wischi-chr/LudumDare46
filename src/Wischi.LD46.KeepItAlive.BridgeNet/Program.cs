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
                Min = "0",
                Max = "1000",
                Value = "1000"
            };

            var inputTickness = new HTMLInputElement
            {
                Type = InputType.Range,
                Min = "0",
                Max = "1000",
                Value = "1000"
            };

            Document.Body.AppendChild(canvas);
            Document.Body.AppendChild(input);
            Document.Body.AppendChild(inputTickness);

            var app = new App(canvas);

            void Update()
            {
                var growth = int.Parse(input.Value) / 1000.0;
                var thick = int.Parse(inputTickness.Value) / 1000.0;

                app.SetGrowState(growth, thick);
            }

            input.AddEventListener(EventType.Input, Update);
            inputTickness.AddEventListener(EventType.Input, Update);
        }
    }
}
