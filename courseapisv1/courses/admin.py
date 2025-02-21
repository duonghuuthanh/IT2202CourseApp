from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse

from courses.models import Category, Course, Lesson
from django.utils.html import mark_safe
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path


class LessonForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget)
    class Meta:
        model = Lesson
        fields = '__all__'


class MyCourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'subject', 'active', 'created_date', 'category']
    search_fields = ['subject']
    list_filter = ['id', 'created_date']
    list_editable = ['subject']
    readonly_fields = ['image_view']

    def image_view(self, course):
        return mark_safe(f"<img src='/static/{course.image.name}' width='120' />")


class MyLessonAdmin(admin.ModelAdmin):
    form = LessonForm

    class Media:
        css = {
            'all': ('/static/css/style.css', )
        }


class MyCourseAdminSite(admin.AdminSite):
    site_header = 'OU eCourse App'


    def get_urls(self):
        return [path('cate-stats/', self.cate_stats_view)] + super().get_urls()


    def cate_stats_view(self, request):
        stats = Category.objects.annotate(course_count=Count('course__id')).values('id', 'name', 'course_count')

        return TemplateResponse(request, 'admin/stats.html', {
            'stats': stats
        })


admin_site = MyCourseAdminSite(name='ecourse')


admin_site.register(Category)
admin_site.register(Course, MyCourseAdmin)
admin_site.register(Lesson, MyLessonAdmin)
