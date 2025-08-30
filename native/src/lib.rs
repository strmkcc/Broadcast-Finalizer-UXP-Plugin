use neon::prelude::*;

fn process_audio(mut cx: FunctionContext) -> JsResult<JsString> {
    // Expect an options object as the first argument.
    let options = cx.argument::<JsObject>(0)?;

    // Get the level values from the options object.
    let vo_level = options.get::<JsNumber, _, _>(&mut cx, "voLevel")?.value(&mut cx);
    let music_level = options.get::<JsNumber, _, _>(&mut cx, "musicLevel")?.value(&mut cx);
    let fx_level = options.get::<JsNumber, _, _>(&mut cx, "fxLevel")?.value(&mut cx);

    // Create a JSON string that includes the received values to prove they were passed correctly.
    let mock_meters = format!(
        r#"{{
            "status": "Received levels",
            "received": {{
                "voLevel": {},
                "musicLevel": {},
                "fxLevel": {}
            }},
            "meters": {{
                "integratedLoudness": -23.0,
                "truePeak": -1.0
            }}
        }}"#,
        vo_level, music_level, fx_level
    );

    Ok(cx.string(mock_meters))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("processAudio", process_audio)?;
    Ok(())
}
