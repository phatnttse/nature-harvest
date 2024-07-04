package com.api.nature_harvest_backend.utils;

import java.text.Normalizer;
import java.util.Locale;

public class StringUtils {

    public static String toSlug(String input) {
        String nospace = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replaceAll("[^\\p{Alnum}]+", "-")
                .toLowerCase(Locale.ENGLISH)
                .replaceAll("-{2,}", "-")
                .replaceAll("^-|-$", "");
        return nospace;
    }
}

