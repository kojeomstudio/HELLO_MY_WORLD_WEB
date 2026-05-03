using System.Text.Json;
using System.Text.Json.Nodes;

namespace WebGameServer.Core.UI;

public class FormspecParser
{
    private static readonly string[] SupportedElements =
    [
        "size", "label", "button", "field", "list", "image", "box",
        "dropdown", "textarea", "checkbox", "bgcolor", "container",
        "pwdfield", "table", "tabheader", "scrollbar", "tooltip",
        "background", "item_image", "hypertext", "animated_image",
        "style", "listring", "vertlabel"
    ];

    public JsonArray Parse(string formspec)
    {
        var elements = new JsonArray();
        if (string.IsNullOrWhiteSpace(formspec)) return elements;

        var pos = 0;
        while (pos < formspec.Length)
        {
            var elementName = ReadElementName(formspec, ref pos);
            if (elementName == null) break;

            pos++;
            if (pos >= formspec.Length || formspec[pos] != '[') continue;

            pos++;
            var content = ReadContent(formspec, ref pos);
            if (content == null) continue;

            var parameters = SplitParameters(content);
            var element = CreateElement(elementName, parameters);
            if (element != null)
            {
                elements.Add(element);
            }
        }

        return elements;
    }

    private static string? ReadElementName(string formspec, ref int pos)
    {
        var start = pos;
        while (pos < formspec.Length && formspec[pos] != '[')
        {
            pos++;
        }

        var name = formspec[start..pos].Trim();
        return string.IsNullOrEmpty(name) ? null : name;
    }

    private static string? ReadContent(string formspec, ref int pos)
    {
        var depth = 1;
        var start = pos;

        while (pos < formspec.Length && depth > 0)
        {
            if (formspec[pos] == '[') depth++;
            else if (formspec[pos] == ']') depth--;

            if (depth > 0) pos++;
        }

        if (depth != 0) return null;

        var content = formspec[start..pos];
        pos++;
        return content;
    }

    private static string[] SplitParameters(string content)
    {
        var result = new List<string>();
        var current = new System.Text.StringBuilder();
        var inEscape = false;

        foreach (char c in content)
        {
            if (inEscape)
            {
                current.Append(c);
                inEscape = false;
            }
            else if (c == '\\')
            {
                inEscape = true;
            }
            else if (c == ';')
            {
                result.Add(current.ToString());
                current.Clear();
            }
            else
            {
                current.Append(c);
            }
        }

        result.Add(current.ToString());
        return result.ToArray();
    }

    private static JsonObject? CreateElement(string name, string[] parameters)
    {
        if (!SupportedElements.Contains(name)) return null;

        var element = new JsonObject { ["type"] = name };

        switch (name)
        {
            case "size":
                if (parameters.Length >= 2 &&
                    float.TryParse(parameters[0], out var w) &&
                    float.TryParse(parameters[1], out var h))
                {
                    element["width"] = w;
                    element["height"] = h;
                }
                break;

            case "label":
                if (parameters.Length >= 3 &&
                    float.TryParse(parameters[0], out var lx) &&
                    float.TryParse(parameters[1], out var ly))
                {
                    element["x"] = lx;
                    element["y"] = ly;
                    element["text"] = parameters[2];
                }
                break;

            case "button":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var bx) &&
                    float.TryParse(parameters[1], out var by) &&
                    float.TryParse(parameters[2], out var bw) &&
                    float.TryParse(parameters[3], out var bh))
                {
                    element["x"] = bx;
                    element["y"] = by;
                    element["width"] = bw;
                    element["height"] = bh;
                    element["name"] = parameters[4];
                    if (parameters.Length >= 6)
                        element["label"] = parameters[5];
                }
                break;

            case "field":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var fx) &&
                    float.TryParse(parameters[1], out var fy) &&
                    float.TryParse(parameters[2], out var fw) &&
                    float.TryParse(parameters[3], out var fh))
                {
                    element["x"] = fx;
                    element["y"] = fy;
                    element["width"] = fw;
                    element["height"] = fh;
                    element["name"] = parameters[4];
                    if (parameters.Length >= 6)
                        element["label"] = parameters[5];
                    if (parameters.Length >= 7)
                        element["default"] = parameters[6];
                }
                break;

            case "list":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[2], out var listX) &&
                    float.TryParse(parameters[3], out var listY) &&
                    float.TryParse(parameters[4], out var listW))
                {
                    element["inventoryLocation"] = parameters[0];
                    element["listName"] = parameters[1];
                    element["x"] = listX;
                    element["y"] = listY;
                    element["width"] = listW;
                    if (parameters.Length >= 6 && float.TryParse(parameters[5], out var listH))
                        element["height"] = listH;
                    if (parameters.Length >= 7 && int.TryParse(parameters[6], out var startIdx))
                        element["startIndex"] = startIdx;
                }
                break;

            case "image":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var ix) &&
                    float.TryParse(parameters[1], out var iy) &&
                    float.TryParse(parameters[2], out var iw) &&
                    float.TryParse(parameters[3], out var ih))
                {
                    element["x"] = ix;
                    element["y"] = iy;
                    element["width"] = iw;
                    element["height"] = ih;
                    element["texture"] = parameters[4];
                }
                break;

            case "box":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var boxX) &&
                    float.TryParse(parameters[1], out var boxY) &&
                    float.TryParse(parameters[2], out var boxW) &&
                    float.TryParse(parameters[3], out var boxH))
                {
                    element["x"] = boxX;
                    element["y"] = boxY;
                    element["width"] = boxW;
                    element["height"] = boxH;
                    element["color"] = parameters[4];
                }
                break;

            case "dropdown":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var ddX) &&
                    float.TryParse(parameters[1], out var ddY) &&
                    float.TryParse(parameters[2], out var ddW) &&
                    float.TryParse(parameters[3], out var ddH))
                {
                    element["x"] = ddX;
                    element["y"] = ddY;
                    element["width"] = ddW;
                    element["height"] = ddH;
                    element["name"] = parameters[4];
                    if (parameters.Length >= 6)
                        element["options"] = parameters[5];
                    if (parameters.Length >= 7 && int.TryParse(parameters[6], out var selIdx))
                        element["selectedIndex"] = selIdx;
                }
                break;

            case "textarea":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var taX) &&
                    float.TryParse(parameters[1], out var taY) &&
                    float.TryParse(parameters[2], out var taW) &&
                    float.TryParse(parameters[3], out var taH))
                {
                    element["x"] = taX;
                    element["y"] = taY;
                    element["width"] = taW;
                    element["height"] = taH;
                    element["name"] = parameters[4];
                    if (parameters.Length >= 6)
                        element["label"] = parameters[5];
                    if (parameters.Length >= 7)
                        element["default"] = parameters[6];
                }
                break;

            case "checkbox":
                if (parameters.Length >= 3 &&
                    float.TryParse(parameters[0], out var cbX) &&
                    float.TryParse(parameters[1], out var cbY))
                {
                    element["x"] = cbX;
                    element["y"] = cbY;
                    element["name"] = parameters[2];
                    if (parameters.Length >= 4)
                        element["label"] = parameters[3];
                    if (parameters.Length >= 5)
                        element["selected"] = parameters[4] == "true";
                }
                break;

            case "bgcolor":
                if (parameters.Length >= 1)
                {
                    element["color"] = parameters[0];
                    if (parameters.Length >= 2)
                        element["fullscreen"] = parameters[1] == "true";
                }
                break;

            case "container":
                if (parameters.Length >= 2 &&
                    float.TryParse(parameters[0], out var cX) &&
                    float.TryParse(parameters[1], out var cY))
                {
                    element["x"] = cX;
                    element["y"] = cY;
                }
                break;

            case "pwdfield":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var px) &&
                    float.TryParse(parameters[1], out var py) &&
                    float.TryParse(parameters[2], out var pw) &&
                    float.TryParse(parameters[3], out var ph))
                {
                    element["x"] = px;
                    element["y"] = py;
                    element["width"] = pw;
                    element["height"] = ph;
                    element["name"] = parameters[4];
                    if (parameters.Length >= 6)
                        element["label"] = parameters[5];
                }
                break;

            case "table":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var tbX) &&
                    float.TryParse(parameters[1], out var tbY) &&
                    float.TryParse(parameters[2], out var tbW) &&
                    float.TryParse(parameters[3], out var tbH))
                {
                    element["x"] = tbX;
                    element["y"] = tbY;
                    element["width"] = tbW;
                    element["height"] = tbH;
                    element["name"] = parameters[4];
                    if (parameters.Length >= 6)
                        element["columns"] = parameters[5];
                    if (parameters.Length >= 7)
                        element["rows"] = parameters[6];
                }
                break;

            case "tabheader":
                if (parameters.Length >= 4 &&
                    float.TryParse(parameters[0], out var thX) &&
                    float.TryParse(parameters[1], out var thY))
                {
                    element["x"] = thX;
                    element["y"] = thY;
                    element["name"] = parameters[2];
                    element["tabs"] = parameters[3];
                    if (parameters.Length >= 5 && int.TryParse(parameters[4], out var thSel))
                        element["selected"] = thSel;
                }
                break;

            case "scrollbar":
                if (parameters.Length >= 7 &&
                    float.TryParse(parameters[0], out var sbX) &&
                    float.TryParse(parameters[1], out var sbY) &&
                    float.TryParse(parameters[2], out var sbW) &&
                    float.TryParse(parameters[3], out var sbH))
                {
                    element["x"] = sbX;
                    element["y"] = sbY;
                    element["width"] = sbW;
                    element["height"] = sbH;
                    element["name"] = parameters[4];
                    element["value"] = parameters[5];
                    element["min"] = parameters[6];
                    if (parameters.Length >= 8)
                        element["max"] = parameters[7];
                    if (parameters.Length >= 9)
                        element["orientation"] = parameters[8];
                }
                break;

            case "tooltip":
                if (parameters.Length >= 3 &&
                    float.TryParse(parameters[0], out var ttX) &&
                    float.TryParse(parameters[1], out var ttY))
                {
                    element["x"] = ttX;
                    element["y"] = ttY;
                    element["text"] = parameters[2];
                }
                break;

            case "background":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var bgX) &&
                    float.TryParse(parameters[1], out var bgY) &&
                    float.TryParse(parameters[2], out var bgW) &&
                    float.TryParse(parameters[3], out var bgH))
                {
                    element["x"] = bgX;
                    element["y"] = bgY;
                    element["width"] = bgW;
                    element["height"] = bgH;
                    element["texture"] = parameters[4];
                }
                break;

            case "item_image":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var iiX) &&
                    float.TryParse(parameters[1], out var iiY) &&
                    float.TryParse(parameters[2], out var iiW) &&
                    float.TryParse(parameters[3], out var iiH))
                {
                    element["x"] = iiX;
                    element["y"] = iiY;
                    element["width"] = iiW;
                    element["height"] = iiH;
                    element["itemName"] = parameters[4];
                }
                break;

            case "hypertext":
                if (parameters.Length >= 5 &&
                    float.TryParse(parameters[0], out var htX) &&
                    float.TryParse(parameters[1], out var htY) &&
                    float.TryParse(parameters[2], out var htW) &&
                    float.TryParse(parameters[3], out var htH))
                {
                    element["x"] = htX;
                    element["y"] = htY;
                    element["width"] = htW;
                    element["height"] = htH;
                    element["name"] = parameters[4];
                    if (parameters.Length >= 6)
                        element["content"] = parameters[5];
                }
                break;

            case "animated_image":
                if (parameters.Length >= 7 &&
                    float.TryParse(parameters[0], out var aiX) &&
                    float.TryParse(parameters[1], out var aiY) &&
                    float.TryParse(parameters[2], out var aiW) &&
                    float.TryParse(parameters[3], out var aiH) &&
                    int.TryParse(parameters[5], out var aiFrames) &&
                    int.TryParse(parameters[6], out var aiDuration))
                {
                    element["x"] = aiX;
                    element["y"] = aiY;
                    element["width"] = aiW;
                    element["height"] = aiH;
                    element["name"] = parameters[4];
                    element["frameCount"] = aiFrames;
                    element["frameDuration"] = aiDuration;
                }
                break;

            case "style":
                if (parameters.Length >= 2)
                {
                    element["name"] = parameters[0];
                    element["properties"] = parameters[1];
                }
                break;

            case "listring":
                if (parameters.Length >= 1)
                {
                    element["name"] = parameters[0];
                }
                break;

            case "vertlabel":
                if (parameters.Length >= 3 &&
                    float.TryParse(parameters[0], out var vlX) &&
                    float.TryParse(parameters[1], out var vlY))
                {
                    element["x"] = vlX;
                    element["y"] = vlY;
                    element["text"] = parameters[2];
                }
                break;
        }

        return element;
    }
}
